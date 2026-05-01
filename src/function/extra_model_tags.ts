import { useDataStore } from '@/store';

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function getExtraModelCleanupTags(): string[] {
    const store = useDataStore();
    const raw_tags = store.settings.额外模型解析配置.清理标签;

    return _(raw_tags.split(/[\s,，、]+/))
        .map(tag => tag.trim().replace(/^<|>$/g, ''))
        .filter(tag => /^[A-Za-z][\w:-]*$/.test(tag))
        .uniqBy(tag => tag.toLowerCase())
        .value();
}

export function removeTaggedBlocks(
    content: string,
    tags: string[],
    { remove_unclosed_tail = false }: { remove_unclosed_tail?: boolean } = {}
): string {
    return tags.reduce((current, tag) => {
        const escaped_tag = escapeRegExp(tag);
        const block_regex = new RegExp(
            `\\n?\\s*<${escaped_tag}\\b[^>]*>[\\s\\S]*?<\\/${escaped_tag}\\s*>`,
            'gi'
        );
        let next = current.replace(block_regex, '');

        if (remove_unclosed_tail) {
            const open_regex = new RegExp(`<${escaped_tag}\\b[^>]*>`, 'gi');
            const opens = [...next.matchAll(open_regex)];
            const last_open = opens.at(-1);
            if (last_open?.index !== undefined) {
                next = next.slice(0, last_open.index).trimEnd();
            }
        }

        return next;
    }, content);
}
