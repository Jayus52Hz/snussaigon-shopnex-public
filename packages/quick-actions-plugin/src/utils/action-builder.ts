import type { QuickAction } from "../types";

export interface ActionBuilder {
    custom?: boolean;
    group?: string;
    icon?: React.ReactElement;
    id: string;
    keywords?: string;
    link?: string;
    name: string;
    priority?: number;
    subtitle?: string;
}

export class QuickActionBuilder {
    private action: Partial<QuickAction> = {};

    constructor(id: string, name: string) {
        this.action.id = id;
        this.action.name = name;
    }

    static create(id: string, name: string): QuickActionBuilder {
        return new QuickActionBuilder(id, name);
    }

    asCustom(): QuickActionBuilder {
        this.action.custom = true;
        return this;
    }

    build(): QuickAction {
        if (!this.action.id || !this.action.name) {
            throw new Error("Action must have both id and name");
        }
        
        return {
            ...this.action,
            keywords: this.action.keywords ?? this.action.name,
            priority: this.action.priority ?? 50
        } as QuickAction;
    }

    withGroup(group: string): QuickActionBuilder {
        this.action.group = group;
        return this;
    }

    withIcon(icon: React.ReactElement): QuickActionBuilder {
        this.action.icon = icon;
        return this;
    }

    withKeywords(keywords: string): QuickActionBuilder {
        this.action.keywords = keywords;
        return this;
    }

    withLink(link: string): QuickActionBuilder {
        this.action.link = link;
        return this;
    }

    withPriority(priority: number): QuickActionBuilder {
        this.action.priority = priority;
        return this;
    }

    withSubtitle(subtitle: string): QuickActionBuilder {
        this.action.subtitle = subtitle;
        return this;
    }
}

export const createAction = (config: ActionBuilder): QuickAction => {
    const builder = QuickActionBuilder.create(config.id, config.name);
    
    if (config.icon) {
        builder.withIcon(config.icon);
    }
    if (config.link) {
        builder.withLink(config.link);
    }
    if (config.keywords) {
        builder.withKeywords(config.keywords);
    }
    if (config.priority !== undefined) {
        builder.withPriority(config.priority);
    }
    if (config.group) {
        builder.withGroup(config.group);
    }
    if (config.subtitle) {
        builder.withSubtitle(config.subtitle);
    }
    
    return builder.build();
};