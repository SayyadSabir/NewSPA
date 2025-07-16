// This file sets up the MSW for the application

// Start the MSW worker
export const startMsw = async () => {
  if (process.env.NODE_ENV === 'development') {
    const { worker } = await import('./browser');
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js'
      }
    });
  }
  return Promise.resolve();
};
