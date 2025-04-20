export function getCategoryName(categoryCode: string) {
    if (categoryCode === 'DOMESTIC') {
        return $localize`:@@domestic:Domestic`;
    } else if (categoryCode === 'INTERNATIONAL') {
        return $localize`:@@domestic:International`;
    }
    return '';
}

export function getCategoryCode(categoryCode: string) {
    if (categoryCode === 'Domestic') {
        return 'DOMESTIC';
    } else if (categoryCode === 'International') {
        return 'INTERNATIONAL';
    }
    return '';
}


export function getSendMailName(isEmailSent: boolean) {
    if (isEmailSent) {
        return $localize`:@@sent:Sent`;
    } else if (isEmailSent === false) {
        return $localize`:@@notSent:Not sent`;
    }
    return '';
}

export function getEmailDeliveryStatus(isSendSuccess: boolean) {
    if (isSendSuccess) {
        return $localize`:@@successful:Successful`;
    } else if (isSendSuccess === false) {
        return $localize`:@@failed:Failed`;
    }
    return '';
}

export function getFileName(filePath: string) {
    if (filePath) {
        return filePath.split('/').pop();
    }
    return null
}