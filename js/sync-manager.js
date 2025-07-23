// This script manages data synchronization for the offline survey application.
// It uses localForage to store data in the browser's most suitable offline storage.

const syncManager = {
    // A queue to hold pending synchronization tasks
    syncQueue: [],
    // A flag to indicate if a synchronization process is currently active
    isSyncing: false,
    // A key for storing the sync queue in localForage
    queueKey: 'sync_queue',

    /**
     * Initializes the synchronization manager.
     * It loads any pending tasks from localForage and starts the sync process.
     */
    init: function() {
        localforage.getItem(this.queueKey).then(queue => {
            if (queue) {
                this.syncQueue = queue;
            }
            this.processQueue();
        }).catch(err => {
            console.error('Error initializing sync manager:', err);
        });
    },

    /**
     * Adds a new data synchronization task to the queue.
     * @param {string} type - The type of the task (e.g., 'save_response').
     * @param {object} data - The data associated with the task.
     */
    enqueue: function(type, data) {
        const task = {
            id: new Date().toISOString() + '_' + Math.random().toString(36).substr(2, 9),
            type: type,
            data: data,
            timestamp: new Date().getTime()
        };
        this.syncQueue.push(task);
        this.saveQueue();
        this.processQueue();
    },

    /**
     * Processes the tasks in the synchronization queue.
     * It ensures that only one sync process runs at a time.
     */
    processQueue: function() {
        if (this.isSyncing || this.syncQueue.length === 0) {
            return;
        }
        this.isSyncing = true;
        const task = this.syncQueue[0];
        this.executeTask(task).then(() => {
            this.syncQueue.shift();
            this.saveQueue();
            this.isSyncing = false;
            this.processQueue();
        }).catch(err => {
            console.error(`Error executing task ${task.id}:`, err);
            this.isSyncing = false;
            // Optional: Implement a retry mechanism with backoff
        });
    },

    /**
     * Executes a single synchronization task.
     * This function should be adapted to handle different types of tasks.
     * @param {object} task - The task to be executed.
     * @returns {Promise} - A promise that resolves when the task is complete.
     */
    executeTask: function(task) {
        console.log(`Executing task: ${task.type}`, task.data);
        // This is a placeholder for the actual synchronization logic.
        // For a real application, this would involve sending data to a server.
        return new Promise((resolve) => {
            // Simulate a network request
            setTimeout(() => {
                console.log(`Task ${task.id} completed.`);
                resolve();
            }, 1000);
        });
    },

    /**
     * Saves the current state of the synchronization queue to localForage.
     */
    saveQueue: function() {
        localforage.setItem(this.queueKey, this.syncQueue).catch(err => {
            console.error('Error saving sync queue:', err);
        });
    }
};

// Initialize the sync manager when the script is loaded
syncManager.init();
