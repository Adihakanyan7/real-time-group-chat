const { docClient } = require("../db"); 
const { PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } = require("@aws-sdk/lib-dynamodb");

const TABLE_NAME = "RoomsTable";

async function saveRoom(room) {
    const params = {
        TableName: TABLE_NAME,
        Item: room,
    };
    try {
        console.log("Saving room to DynamoDB:", params);
        await docClient.send(new PutCommand(params));
        console.log("✅ Room saved successfully!");
    } catch (error) {
        console.error("❌ Error saving room to DynamoDB:", error);
        throw error;
    }
}

async function getRoomById(roomId) {
    try {
        console.log(`🔍 Fetching room with ID: ${roomId}`);

        const params = {
            TableName: TABLE_NAME,
            Key: { roomId },
        };

        const { Item } = await docClient.send(new GetCommand(params));
        return Item || null;
    } catch (error) {
        console.error("❌ Error retrieving room:", error);
        throw error;
    }
}

async function getPaginatedRooms(lastKey) {
    try {
        console.log("Fetching paginated rooms from DynamoDB...");

        const params = {
            TableName: TABLE_NAME,
            Limit: 5, // Fetch 5 rooms per page
        };

        if (lastKey) {
            params.ExclusiveStartKey = { roomId: lastKey }; // Start from last fetched item
        }

        const data = await docClient.send(new ScanCommand(params));

        return {
            rooms: data.Items || [],
            lastEvaluatedKey: data.LastEvaluatedKey ? data.LastEvaluatedKey.roomId : null,
        };
    } catch (error) {
        console.error("❌ Error fetching paginated rooms:", error);
        throw error;
    }
}

async function updateRoom( roomId, updates) {
    try {
        console.log(`Updating room with ID: ${roomId}`);

        const params = {
            TableName: TABLE_NAME,
            Key: { roomId },
            UpdateExpression: "set #name = :name, #description = :description",
            ExpressionAttributeNames: {
                "#name": "name",
                "#description": "description",
            },
            ExpressionAttributeValues: {
                ":name": updates.name,
                ":description": updates.description,
            },
            ReturnValues: "ALL_NEW",
        };

        const { Attributes } = await docClient.send(new UpdateCommand(params));
        
        console.log("✅ Room updated successfully:", Attributes);
        return Attributes;
    } catch (error) {
        console.error("❌ Error updating room:", error);
        throw error;
    }
}

async function deleteRoomById(roomId) {
    try {
        console.log(`Deleting room with ID: ${roomId}`);

        const params = {
            TableName: TABLE_NAME,
            Key: { roomId },
        };

        await docClient.send(new DeleteCommand(params));
        console.log("✅ Room deleted successfully!");
        return { message: "Room deleted successfully" };
    } catch (error) {
        console.error("❌ Error deleting room:", error);
        throw error;
    }
}
module.exports = { saveRoom, getRoomById, getPaginatedRooms, updateRoom, deleteRoomById };
