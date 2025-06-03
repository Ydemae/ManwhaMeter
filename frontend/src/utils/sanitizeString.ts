export function sanitize_string( to_sanitize: string): string {
    return to_sanitize.replaceAll("/[^A-Za-z0-9\ \-\.]/", '');
}

export fun