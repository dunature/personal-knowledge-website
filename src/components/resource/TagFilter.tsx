/**
 * 标签筛选组件
 * 显示已选标签，支持移除和清除所有筛选
 */

import React from 'react';
import { Tag } from '@/components/ui/Tag';
import { Button } from '@/components/ui/Button';

interface TagFilterProps {
    selectedTags: string[];
    onRemoveTag: (tag: string) => void;
    onClearAll: () => void;
}

export const TagFilter: React.FC<TagFilterProps> = ({
    selectedTags,
    onRemoveTag,
    onClearAll,
}) => {
    if (selectedTags.length === 0) {
        return null;
    }

    return (
        <div className="flex items-center gap-3 p-4 bg-[#F5F5F5] rounded-lg animate-fadeIn">
            <span className="text-sm text-[#666] font-medium">筛选标签：</span>

            <div className="flex flex-wrap gap-2 flex-1">
                {selectedTags.map((tag) => (
                    <Tag
                        key={tag}
                        variant="content"
                        color={{ bg: '#E3F2FD', text: '#0047AB' }}
                        removable
                        onRemove={() => onRemoveTag(tag)}
                    >
                        {tag}
                    </Tag>
                ))}
            </div>

            <Button
                variant="text"
                size="small"
                onClick={onClearAll}
                className="text-[#0047AB] hover:text-[#003580]"
            >
                清除筛选
            </Button>
        </div>
    );
};
