const CHUNK_SIZE = 15;

export function chunkText(msg: string) {
    return Array.from({ length: Math.ceil(msg.length / CHUNK_SIZE) }, (v, i) =>
        msg.slice(i * CHUNK_SIZE, i * CHUNK_SIZE + CHUNK_SIZE)
    ) as string[];
}