const { getComponentsList }  = require('./config/helpers');

const doAsync = async () => {
  const components = await getComponentsList();
  if (window) {
    window['$COMPONENTS'] = components;
    window['$DEV'] = false;
  }

  class ResizeObserver {
    observe() {
      //
    }
    unobserve() {
      //
    }
    disconnect() {
      //
    }
  };

  if (window) {
    window.ResizeObserver = ResizeObserver;
  }

  const visualViewportMock = new EventTarget();
  visualViewportMock.offsetLeft = 0;
  visualViewportMock.offsetTop = 0;
  if (window) {
    window.visualViewport = visualViewportMock;
  }
}

module.exports = doAsync;
