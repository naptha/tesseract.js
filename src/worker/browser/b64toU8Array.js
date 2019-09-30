module.exports = s => new Uint8Array(atob(s).split('').map(c => c.charCodeAt(0)));
