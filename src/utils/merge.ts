// export const allowedFileTypes = [
//   "image/png",
//   "image/jpg",
//   "image/jpeg",
//   "video/mp4",
//   "video/mkv",
//   "video/webm",
//   "video/ogg",
// ];

export const allowedFileTypesPhoto = ["png", "jpg", "jpeg"];

export const allowedFileTypesVideo = ["mp4", "mkv", "webm", "ogg"];

export interface GeneratedSeat {
  seat_number: string;
  status: "available" | "booked" | "not-available";
}

export interface SeatLayout {
  total_rows: number;
  seat_per_row: number;
  seats: GeneratedSeat[];
}

class SeatGenerator {
  static generateRowLabels(totalRows: number): string[] {
    const rows: string[] = [];

    for (let i = 0; i < totalRows; i++) {
      // jadinya adalah A, B, C, D, E, AA, BB, dst
      rows.push(this.getRowLabel(i));
    }

    return rows;
  }

  static getRowLabel(index: number): string {
    const label_normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (index < 26) {
      return label_normal[index];
    } else {
      const firstLetterIndex = Math.floor((index - 26) / 26);
      const secondLetterIndex = (index - 26) % 26;

      return label_normal[firstLetterIndex] + label_normal[secondLetterIndex];
    }
  }

  static getMaxRows(): number {
    // kalkulasi jika total rows 26(A-Z) + 26x26(AA-ZZ) = 702 rows maksimal
    return 26 + 26 * 26;
  }

  static generateSeatLayout(
    totalRows: number,
    seatsPerRow: number
  ): SeatLayout {
    const seats: GeneratedSeat[] = [];

    const maxRows = this.getMaxRows();

    if (totalRows > maxRows) {
      throw new Error(`Total rows cannot exceeded. Max: ${maxRows}`);
    }

    if (totalRows <= 0) {
      throw new Error(`Total rows must be greater than 0`);
    }

    if (seatsPerRow <= 0) {
      throw new Error(`Seat per row must be greater than 0`);
    }

    const rowLabels = this.generateRowLabels(totalRows);

    for (let rowIndex = 0; rowIndex < totalRows; rowIndex++) {
      const rowLabel = rowLabels[rowIndex];
      for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
        const seatNumber = `${rowLabel}${seatNum.toString().padStart(2, "0")}`;

        seats.push({
          seat_number: seatNumber,
          status: "available",
        });
      }
    }

    return {
      total_rows: totalRows,
      seat_per_row: seatsPerRow,
      seats,
    };
  }
}

export const seatGenerator = SeatGenerator;
