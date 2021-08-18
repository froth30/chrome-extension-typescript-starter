export class HelloService {

    private interval: number = 2000;
    private intervalId?: NodeJS.Timer;

    private onStarted         = new EventEmitter<void>();
    private onEnded           = new EventEmitter<void>();
    private onIntervalElapsed = new EventEmitter<void>();

    constructor() {
        this.subscribeEventEmitters();
    }

    private _isActive: boolean = false;
    private get isActive(): boolean {
        return this._isActive;
    }
    private set isActive(value: boolean) {
        const oldValue = this._isActive;
        this._isActive = value;
        if (value === oldValue) return;
        if (value) this.onStarted.emit();
        else       this.onEnded  .emit();
    }

    start(): void {
        this.isActive = true;
    }

    stop(): void {
        this.isActive = false;
    }

    private subscribeEventEmitters(): void {
        this.onStarted         .subscribe(this.handleStartedEvent         .bind(this));
        this.onEnded           .subscribe(this.handleEndedEvent           .bind(this));
        this.onIntervalElapsed .subscribe(this.handleIntervalElapsedEvent .bind(this));
    }

    private handleStartedEvent(): void {
        console.log('HelloService started.');
        this.intervalId = setInterval(() => {
            this.onIntervalElapsed.emit();
        }, this.interval);
    }

    private handleEndedEvent(): void {
        clearInterval(this.intervalId!);
        console.log('HelloService ended.');
    }

    private handleIntervalElapsedEvent(): void {
        this.sayHello();
    }

    private sayHello(): void {
        console.log('Hello, World!');
    }

}

type EventListener<T> = (args: T) => any;

class EventEmitter<T> {

    private listeners: EventListener<T>[];

    constructor() {
        this.listeners = [];
    }

    subscribe(listener: EventListener<T>): void {
        this.listeners.push(listener);
    }

    unsubscribe(listener?: EventListener<T>): void {
        if (listener) {
            this.listeners = this.listeners.filter(value => value !== listener);
        } else {
            this.listeners = [];
        }
    }

    emit(args: T): void {
        this.listeners.forEach(listener => {
            listener(args);
        });
    }

}
