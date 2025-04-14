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
    } else {
        return $localize`:@@notSent:Not sent`;
    }
}

export function getEmailDeliveryStatus(isSendSuccess: boolean) {
    if (isSendSuccess) {
        return $localize`:@@successful:Successful`;
    } else {
        return $localize`:@@failed:Failed`;
    }
}