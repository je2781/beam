export function generateTransactionId(sequence: number): string {
    const paddedNumber = sequence.toString().padStart(6, '0');
    return `TXN${paddedNumber}`;
  }
  