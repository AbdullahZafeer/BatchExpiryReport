import ExtensionAPI from "sap/fe/core/ExtensionAPI";
import MessageToast from "sap/m/MessageToast";
import MessageBox from "sap/m/MessageBox";
import BusyIndicator from "sap/ui/core/BusyIndicator";



// Reusing your robust COA Binary Converter
function getPdfBlobUrl(base64: string, mimeType: string): string {
    if (!base64) throw new Error("Empty PDF content received.");
    let cleanedBase64 = String(base64).trim();
    if (cleanedBase64.includes(",")) cleanedBase64 = cleanedBase64.split(",")[1];
    cleanedBase64 = cleanedBase64.replace(/-/g, "+").replace(/_/g, "/").replace(/\s/g, "");
    while (cleanedBase64.length % 4 !== 0) cleanedBase64 += "=";
    
    const byteCharacters = window.atob(cleanedBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType || "application/pdf" });
    return URL.createObjectURL(blob);
}

export async function printCollective(this: ExtensionAPI): Promise<void> {
    try {
        BusyIndicator.show(0);
        
        // 1. Retrieve the OData V4 Model from the current view
        const oModel = (this as any).getRouting().getView().getModel();
        
        // 2. Generate a Header Context bound to the Entity Set Collection
        //    (This satisfies the UI5 requirement for a collection-bound RAP static action)
        const oCollectionContext = oModel.bindList("/ExpiryHeader").getHeaderContext();

        // 3. Invoke the action explicitly passing the model and collection context
        const oResult: any = await (this as any).editFlow.invokeAction(
            "com.sap.gateway.srvd.zqm_fdp_expiry.v0001.PrintCollectivePDF", 
            {
                contexts: oCollectionContext,
                model: oModel,
                skipParameterDialog: true
            }
        );

        // 4. Extract payload (handling standard Fiori V4 response nesting)
        let resultData = oResult?.getObject ? oResult.getObject() : oResult?.value || oResult;
        const sBase64 = resultData?.FileContent || resultData?.fileContent || resultData?.FILECONTENT;
        const sFileName = resultData?.FileName || resultData?.fileName || "BatchExpiryReport.pdf";

        if (!sBase64) {
            MessageBox.error("PDF data was not returned from the backend.");
            return;
        }

        // 5. Convert and Download (using your existing robust conversion logic)
        const sPdfUrl = getPdfBlobUrl(sBase64, "application/pdf");
        const oLink = document.createElement("a");
        oLink.href = sPdfUrl;
        oLink.download = sFileName;
        
        document.body.appendChild(oLink);
        oLink.click();
        document.body.removeChild(oLink);
        
        // Cleanup memory
        setTimeout(() => URL.revokeObjectURL(sPdfUrl), 100);
        MessageToast.show("Report downloaded successfully.");

    } catch (error: any) {
        console.error("Action execution failed:", error);
        MessageBox.error(error?.message || "Error while generating PDF.");
    } finally {
        BusyIndicator.hide();
    }
}