/**
 * @param { string } key - Key name inside the storage API to save the data.
 * @param { {} | [] } data - Object or array of data to be saved.
 */
async function save(key, data) {
    try {
        chrome.storage.local.set({ [key]: data });
        return 1;
    } catch (error) {
        throw new Error(error);
    };
};

/**
 * @param { string } key - Key name inside the storage API to load the data.
 */
async function load(key) {
    try {
        const data = await chrome.storage.local.get([key]);
        return data[key];
    } catch (error) {
        throw new Error(error);
    };
};

/**
 * Should only be used for debugging ? or if the user wants to delete all data.
 */
async function clear() {
    chrome.storage.local.clear();
};