import { files, uidGen } from '@/utils';

export interface IFile {
  file: File;
  size: number;
  name: string;
  uid: number;
  extension: string;
  filename: string;
  sizeFormat: string;
  status: FileStatus;
  isNoneStatus: boolean;
  isExceptionalStatus: boolean;
  isAbortedStatus: boolean;
  isUploadingStatus: boolean;
  isUploadedStatus: boolean;
  progress: number;
  response: unknown;
  responseStatus: number;
  error: Error;
  setError: (error: Error) => void;
  setResponse: (text: unknown, status: number) => void;
  setProgress: (value: number) => void;
  abort: () => void;
}

export enum FileStatus {
  None = 0,
  Uploading = 1,
  Success = 2,
  Error = 3,
  Aborted = 4,
  Canceled = 5,
  Overflow = 6,
}

export interface IUploaderOptions {
  maximum: number;
  method: string;
  headers: Record<string, string>;
  url: string;
}

export class FileController implements IFile {
  size: number;
  name: string;
  uid: number;
  progress: number;
  response: unknown;
  responseStatus: number;
  error: Error;

  constructor(
    public file: File,
    public options: IUploaderOptions
  ) {
    this.size = file.size;
    this.name = file.name;
    this.progress = 0;
    this.uid = uidGen(8, '0-9') as number;
  }

  setError(error: Error) {
    this.progress = 0;
    this.error = error;
  }

  setResponse(text: unknown, status: number) {
    this.response = text;
    this.responseStatus = status;
  }

  setProgress(value: number) {
    this.error = null;
    this.progress = value;
  }

  abort() {
    this.response = 'Abort';
    this.responseStatus = 0;
  }

  get extension() {
    return files.getExtension(this.name);
  }

  get filename() {
    return files.getFileName(this.name);
  }

  get sizeFormat(): string {
    return files.formatSize(this.size);
  }

  get status(): FileStatus {
    if (this.options.maximum && this.size > this.options.maximum) {
      return FileStatus.Overflow;
    }
    if (this.response === 'Abort' && this.responseStatus === 0) {
      return FileStatus.Aborted;
    }
    if (this.response === 'Timeout' && this.responseStatus === 0) {
      return FileStatus.Canceled;
    }
    if (this.progress && this.progress < 1) {
      return FileStatus.Uploading;
    }
    if (this.progress === 1) {
      return FileStatus.Success;
    }
    if (this.error) {
      return FileStatus.Error;
    }
    return FileStatus.None;
  }

  get isNoneStatus(): boolean {
    return this.status === FileStatus.None;
  }

  get isExceptionalStatus(): boolean {
    return [FileStatus.Error, FileStatus.Canceled, FileStatus.Overflow].includes(this.status);
  }

  get isAbortedStatus(): boolean {
    return this.status === FileStatus.Aborted;
  }

  get isUploadingStatus(): boolean {
    return this.status === FileStatus.Uploading;
  }

  get isUploadedStatus(): boolean {
    return this.status === FileStatus.Success;
  }
}

export class UploaderController {
  private readonly items: Array<IFile> = [];
  private readonly events: Map<string, (...args: Array<unknown>) => void> = new Map();
  private readonly promises: Map<number, Promise<FormData>> = new Map();

  constructor(public options: IUploaderOptions) {}

  on(event: string, callback: (payload: unknown) => void) {
    if (this.events.has(event)) {
      this.events.delete(event);
    }
    this.events.set(event, callback);
  }

  flush() {
    this.events.clear();
  }

  setOptions(value: Partial<IUploaderOptions>) {
    this.options = {
      ...this.options,
      ...value,
    };
  }

  add(payload: File | Array<File>) {
    if (!payload) {
      return;
    }
    if (Array.isArray(payload)) {
      if (!payload.length) {
        return;
      }
      for (const item of payload) {
        this.add(item);
      }
      this.fileEventInput();
      return;
    }
    const item = new FileController(payload, this.options);
    this.items.push(item);
    this.fireEventUpdate();
  }

  send(uid: number) {
    const xhr = new XMLHttpRequest();
    xhr.open(this.options.method, this.options.url);
    const index = this.getItemIndex(uid);
    const item = index > -1 ? this.items[index] : null;
    if (!item) {
      return;
    }
    const payload = item ? item.file : null;

    if (!payload) {
      return;
    }

    const responseText = () => {
      if (xhr.responseText) {
        const contentType = xhr.getResponseHeader('Content-Type');
        if (contentType && contentType.indexOf('/json') !== -1) {
          return JSON.parse(xhr.responseText);
        }
        return xhr.responseText;
      }
    };

    xhr.upload.onprogress = (e: ProgressEvent) => {
      if (!e.lengthComputable) {
        return;
      }
      item.setProgress(Number((e.loaded / e.total).toFixed(2)));
      this.fireEventUpdate();
    };

    let interval = setInterval(() => {
      if (item.response === 'Abort' && item.responseStatus === 0) {
        try {
          xhr.abort();
          xhr.timeout = 1;
        } catch (e) {
          //
        }
      }
    }, 100);

    const onerror = (e: ProgressEvent) => {
      item.setError(new Error(xhr.statusText));
      item.setResponse(responseText(), xhr.status);
      if (interval) {
        clearInterval(interval);
        interval = undefined;
      }
      this.fireEventUpdate();
    };

    const onabort = (e: ProgressEvent) => {
      if (interval) {
        clearInterval(interval);
        interval = undefined;
      }
      this.fireEventUpdate();
    };

    const ontimeout = (e: ProgressEvent) => {
      item.setResponse('Timeout', 0);
      if (interval) {
        clearInterval(interval);
        interval = undefined;
      }
      this.fireEventUpdate();
    };

    const onload = (e: ProgressEvent) => {
      if (xhr.status >= 400) {
        onerror(e);
        return;
      }
      item.setProgress(1);
      item.setResponse(responseText(), xhr.status);
      this.fireEventUpdate();
      setTimeout(() => {
        this.remove(item.uid);
        if (!this.hasItems) {
          this.fireEventComplete();
        }
      }, 1000);
    };

    xhr.onload = onload;
    xhr.onerror = onerror;
    xhr.onabort = onabort;
    xhr.ontimeout = ontimeout;

    const form = new FormData();
    form.append('file', payload, payload.name);
    form.append('size', JSON.stringify(payload.size));

    for (const key in this.options.headers) {
      xhr.setRequestHeader(key, this.options.headers[key]);
    }

    this.createPromise(item, form);

    const promise = this.promises.get(item.uid);

    promise
      .then((body: FormData) => {
        xhr.send(body);
      })
      .catch(e => {
        item.error = e;
        this.fireEventUpdate();
      })
      .finally(() => {
        this.deletePromise(item);
      });
  }

  createPromise(item: IFile, body: FormData) {
    if (this.promises.has(item.uid)) {
      return;
    }
    const promise = new Promise<FormData>((resolve, reject) => {
      this.fireEventReady(item, body, resolve, reject);
    });
    this.promises.set(item.uid, promise);
  }

  deletePromise(item: IFile) {
    this.promises.delete(item.uid);
  }

  remove(uid: number) {
    if (!this.hasItems) {
      return;
    }
    const index = this.getItemIndex(uid);
    if (index > -1) {
      this.items.splice(index, 1);
      this.fireEventUpdate();
      this.fileEventInput();
    }
  }

  abort(uid: number) {
    const index = this.getItemIndex(uid);
    const item = index > -1 ? this.items[index] : null;
    if (!item) {
      return;
    }
    item.abort();
  }

  private getItemIndex(uid: number) {
    if (!this.hasItems) {
      return;
    }
    return this.items.findIndex(item => item.uid === uid);
  }

  private fileEventInput() {
    if (this.events.has('input')) {
      const callback = this.events.get('input');
      callback(this.items);
    }
  }

  private fireEventUpdate() {
    if (this.events.has('update')) {
      const callback = this.events.get('update');
      callback(this.items);
    }
  }

  private fireEventComplete() {
    if (this.events.has('complete')) {
      const callback = this.events.get('complete');
      callback();
    }
  }

  private fireEventReady(item: IFile, body: FormData, resolve: (value: FormData) => void, reject: (e: Error) => void) {
    if (this.events.has('ready')) {
      const callback = this.events.get('ready');
      callback(item, body, resolve, reject);
    }
  }

  private get hasItems(): boolean {
    return this.items.length > 0;
  }
}
