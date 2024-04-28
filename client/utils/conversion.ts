export function base64ToBlob(base64: string, mimeType: string) {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
}

export function blobToFile(blob: Blob, filename: string) {
    return new File([blob], filename, { type: blob.type });
}

export function getDaysUntilExpiry(expiryDate: string): number {
    const currentDate = new Date();
    const expiry = new Date(expiryDate);

    if (isNaN(expiry.getTime())) {
        throw new Error('Invalid expiry date');
    }

    const difference = expiry.getTime() - currentDate.getTime(); // difference in milliseconds
    if (isNaN(difference)) {
        throw new Error('Error calculating difference between dates');
    }

    // Convert milliseconds to days
    const days = Math.ceil(difference / (1000 * 60 * 60 * 24));

    return days;
}