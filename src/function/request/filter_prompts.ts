import { getExtraModelCleanupTags, removeTaggedBlocks } from '@/function/extra_model_tags';
import { useDataStore } from '@/store';

export function filterPrompts({ messages }: { messages: SillyTavern.SendingMessage[] }) {
    const store = useDataStore();

    const text_messages = messages.filter(message => typeof message.content === 'string') as {
        role: string;
        content: string;
    }[];

    if (store.settings.更新方式 === '额外模型解析' && !store.runtimes.is_during_extra_analysis) {
        const cleanup_tags = getExtraModelCleanupTags();
        text_messages
            .filter(() => cleanup_tags.length > 0)
            .forEach(message => (message.content = removeTaggedBlocks(message.content, cleanup_tags)));
    }
    text_messages
        .filter(message => message.content.includes('<StatusPlaceHolderImpl/>'))
        .forEach(
            message =>
                (message.content = message.content.replaceAll('\n<StatusPlaceHolderImpl/>', ''))
        );
}
