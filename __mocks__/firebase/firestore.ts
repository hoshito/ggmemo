export const getFirestore = jest.fn().mockReturnValue({
  collection: jest.fn(),
  doc: jest.fn(),
});

// Firestoreのクエリ操作関連
export const collection = jest.fn();
export const doc = jest.fn();
export const getDocs = jest.fn();
export const getDoc = jest.fn();
export const addDoc = jest.fn();
export const updateDoc = jest.fn();
export const deleteDoc = jest.fn();
export const query = jest.fn();
export const where = jest.fn();
export const orderBy = jest.fn();
export const limit = jest.fn();
export const startAfter = jest.fn();
class TimestampClass {
  seconds: number;
  nanoseconds: number;

  constructor(seconds: number, nanoseconds: number) {
    this.seconds = seconds;
    this.nanoseconds = nanoseconds;
  }

  toDate(): Date {
    return new Date(this.seconds * 1000 + this.nanoseconds / 1000000);
  }

  toMillis(): number {
    return this.seconds * 1000 + this.nanoseconds / 1000000;
  }

  isEqual(other: TimestampClass): boolean {
    return (
      this.seconds === other.seconds && this.nanoseconds === other.nanoseconds
    );
  }

  toString(): string {
    return `Timestamp(seconds=${this.seconds}, nanoseconds=${this.nanoseconds})`;
  }

  valueOf(): string {
    return this.toString();
  }

  toJSON(): { seconds: number; nanoseconds: number } {
    return {
      seconds: this.seconds,
      nanoseconds: this.nanoseconds,
    };
  }

  static now(): TimestampClass {
    const date = new Date();
    return new TimestampClass(
      Math.floor(date.getTime() / 1000),
      (date.getTime() % 1000) * 1000000
    );
  }

  static fromDate(date: Date): TimestampClass {
    return new TimestampClass(
      Math.floor(date.getTime() / 1000),
      (date.getTime() % 1000) * 1000000
    );
  }
}

export const Timestamp = jest
  .fn()
  .mockImplementation((seconds: number, nanoseconds: number) => {
    return new TimestampClass(seconds, nanoseconds);
  }) as unknown as typeof TimestampClass & { prototype: TimestampClass };

Object.assign(Timestamp, {
  now: jest.fn().mockImplementation(() => TimestampClass.now()),
  fromDate: jest
    .fn()
    .mockImplementation((date: Date) => TimestampClass.fromDate(date)),
});
