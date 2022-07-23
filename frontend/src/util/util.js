export function formatAnswerType(answerType) {
    const s = answerType.replaceAll('_', ' ').toLowerCase();
    return s && s[0].toUpperCase() + s.slice(1);
}