if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('/sw.js',{scope:'./'})
        .then((sw:ServiceWorkerRegistration) => { sw.update()});
}
