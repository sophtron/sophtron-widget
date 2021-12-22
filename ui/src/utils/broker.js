export default {
    postMessage : (obj) => {
        obj.type = 'message';
        window.parent.postMessage(obj, '*');
    },
    postAction : (obj) => {
        obj.type = 'action';
        window.parent.postMessage(obj, '*');
    }
}