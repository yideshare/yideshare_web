export interface User {
    netId: string;
}

export interface Ride {
    id: string;
    ownerName: string;
    ownerPhone: string;
    beginning: string;
    destination: string;
    description: string;
    startTime: Date;
    endTime: Date;
    totalSeats: number;
    currentTakenSeats: number;
    isClosed: boolean;
}

export interface RideRequest extends Message {
    rideId: string;
    isAccepted: boolean;
}

export interface Message {
    id: string;
    senderId: string;
    receiverId: string;
    timestamp: Date;
    payload: string;
}

