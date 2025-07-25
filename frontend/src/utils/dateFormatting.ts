// Copyright (c) 2025 Ydemae
// Licensed under the AGPLv3 License. See LICENSE file for details.

export function format_date(date: string): string {

    if (!date){
        return "null";
    }

    let dateObject = new Date(date);

    const day = dateObject.getDate().toString().padStart(2, '0');
    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObject.getFullYear();

    return `${day}/${month}/${year}`;
}