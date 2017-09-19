/**
* @module EventEmitter
*/

class EventEmitter {
    /**
    * Create listeners
    * @return void
    */
    constructor() {
        this.listeners = new Map();
    }
    /**
    * Check if event name is already exist
    * @param {string} eventName event name
    * @return {boolean} checking result
    */
    checkExist(eventName){
        return this.listeners.has(eventName);
    }
    /**
    * Subscribe listener on event
    * @param {sring} evt event name
    * @param {function} listener listener
    * @return {EventEmitter}
    */
    on(evt, listener, once){
        let data = {
            listener
        };
        if(once){
            data.once = true;
        }
        if(!this.checkExist(evt)){
            this.listeners.set(evt, new Set());
        }
        this.listeners.get(evt).add(data);
        return this;
    }
    /**
    * Subscribe to a one-time event
    * @param {sring} evt event name
    * @param {function} listener listener
    * @return {EventEmitter}
    */
    once(evt, listener){
        this.on(evt, listener, true);
        return this;
    }
    /**
    * Remove listeners. This method can be invoked by different ways.
    * @example
    * Remove all listeners:
    * ...off();
    * @example
    * Remove all listeners of event:
    * ...off('eventName');
    * @example
    * Remove listener of event:
    * ...off('eventName', listener);
    * @param {string} evt event name
    * @param {function} listener listener
    * @return {EventEmitter}
    */
    off(evt, ...list){
        if(!evt){
            this.listeners.clear();
        }else{
            if(!list.length){
                this.listeners.delete(evt);
            }else{
                let listeners = this.listeners.get(evt);

                list.map(listener => {
                    let target = null;
                    for(let list of listeners){
                        if(list.listener === listener){
                            target = list;
                            break;
                        }
                    }
                    if(target){
                        listeners.delete(target);
                    }
               });

                if(!listeners.size){
                    this.listeners.delete(evt);
                }	
            }
        }
        return this;
    }
    /**
    * Emit listeners
    * @example
    * emitter.emit('eventName', listener1, listener2)
    * @param {string} evt event name
    * @param {function} listener listener
    * @return {EventEmitter}
    */
    emit(evt, ...args){
        if (this.checkExist(evt)) {
            for (const target of this.listeners.get(evt)) {
                target.listener(...args);
                if(target.once){
                    this.off(evt, target.listener);
                }
            }
        }
        return this;
    }
}
