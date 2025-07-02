// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

export function sanitize_string( to_sanitize: string): string {
    return to_sanitize.replaceAll("/[^A-Za-z0-9\ \-\.]/", '');
}