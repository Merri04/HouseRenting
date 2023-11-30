import { useMessage } from "../providers/message-provider";

export const useNotify = () => {
    var notify = useMessage();
    const error = (message) => {
        if (message instanceof Error) notify.AddMessage(notify.MessageStatuses.Error, message.message);
        else notify.AddMessage(notify.MessageStatuses.Error, message);
    };
    const success = (message) => notify.AddMessage(notify.MessageStatuses.Success, message);
    const warning = (message) => notify.AddMessage(notify.MessageStatuses.Warning, message);

    return { error, success, warning };
};
