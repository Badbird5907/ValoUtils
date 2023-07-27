import { app } from 'electron';
import * as path from 'path';
import * as fs from 'fs';

interface StoreOptions {
    configName: string;
    defaults: Record<string, any>;
}

class Store {
    private path: string;
    private data: Record<string, any>;

    constructor(opts: StoreOptions) {
        const userDataPath = app.getPath('userData');
        this.path = path.join(userDataPath, opts.configName + '.json');
        this.data = this.parseDataFile(this.path, opts.defaults);
        console.log(`DataStore ${opts.configName} loaded from ${this.path}`);
    }

    // This will just return the property on the `data` object
    get(key: string): any {
        return this.data[key];
    }

    // ...and this will set it
    set(key: string, val: any): void {
        this.data[key] = val;
        fs.writeFileSync(this.path, JSON.stringify(this.data));
    }

    private parseDataFile(filePath: string, defaults: Record<string, any>): Record<string, any> {
        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        } catch (error) {
            // if there was some kind of error, return the passed-in defaults instead.
            return defaults;
        }
    }
}

export default Store;
