module.exports = {
  ci: {
    upload: {
      target: 'temporary-public-storage'
      //target: 'filesystem' // for keeping reports locally
    },
    collect: {
      "settings": {
        "chromeFlags": "--disable-gpu --no-sandbox"
      }
    }
  }
};
