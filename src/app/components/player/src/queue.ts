
export class Queue<T> {
    private _records: T[] = [];
    private _listeners: ((queue: T[]) => void)[] = [];

    public enqueue(...records: T[]) {
        this._records.push(...records);
        this.fireQueueUpdate();
    }

    public dequeue(): T | undefined {
        const element = this._records.shift();
        this.fireQueueUpdate();
        return element;
    }

    public get records() {
        return this._records;
    }

    public set records(value: T[]) {
        this._records = value;
        this.fireQueueUpdate();
    }

    public get length(): number {
        return this._records.length;
    }

    public addListener(listener: (queue: T[]) => void) {
        this._listeners.push(listener);
    }

    private fireQueueUpdate() {
        for (const listener of this._listeners) {
            listener(this._records);
        }
    }
}
