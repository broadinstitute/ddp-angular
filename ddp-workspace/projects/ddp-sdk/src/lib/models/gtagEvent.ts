export interface GTagEvent {
    event_name: string;
    parameters: {
        page_location: string;
        click_text?: string;
        click_url?: string;
    };
}
