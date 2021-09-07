export type DataRequirement = "exists" | "full-access";

export type DataRequest = {
    from: string;
    requirements: {
        email?: DataRequirement;
        phone?: DataRequirement;
    };
};

export function extractDataRequest(): DataRequest | undefined {
    const params = new URL(window.location.href).searchParams;
    const req = params.get("requirements");
    if (req) {
        return JSON.parse(req) as DataRequest;
    }
    return undefined;
}
