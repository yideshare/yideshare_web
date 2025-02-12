export interface Ride {
    rideId: string;
    netId: string;
    name: string;
    phone: string;
    beginning: string;
    destination: string;
    startTime: Date;
    endTime: Date;
    totalSeats: number;
}

export interface Message {
    messageId: string;
    senderId: string;
    receiverId: string;
    timestamp: Date;
    payload: string;
}

export interface RideRequest extends Message {
    rideId: string;
    isAccepted: boolean;
}

export interface User {
    netId: string;
    profilePicture: string;
}

export interface Friendship {
    firstUserId: string;
    secondUserId: string;
}
