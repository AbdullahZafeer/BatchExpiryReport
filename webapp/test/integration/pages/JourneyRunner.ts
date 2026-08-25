import JourneyRunner from "sap/fe/test/JourneyRunner";
import ListReport from "sap/fe/test/ListReport";
import ObjectPage from "sap/fe/test/ObjectPage";
import CustomExpiryHeaderListGenerated from "./ExpiryHeaderList.gen";
import CustomExpiryHeaderObjectPageGenerated from "./ExpiryHeaderObjectPage.gen";
import CustomExpiryItemObjectPageGenerated from "./ExpiryItemObjectPage.gen";

const runner = new JourneyRunner({
    launchUrl: sap.ui.require.toUrl("zqmexpiryui") + "/test/flp.html#app-preview",
    pages: {
        onTheExpiryHeaderListGenerated: new ListReport(
            {
                appId: "zqmexpiryui",
                componentId: "ExpiryHeaderList",
                entitySet: "",
                contextPath: "/ExpiryHeader"
            },
            CustomExpiryHeaderListGenerated
        ),
        onTheExpiryHeaderObjectPageGenerated: new ObjectPage(
            {
                appId: "zqmexpiryui",
                componentId: "ExpiryHeaderObjectPage",
                entitySet: "",
                contextPath: "/ExpiryHeader"
            },
            CustomExpiryHeaderObjectPageGenerated
        ),
        onTheExpiryItemObjectPageGenerated: new ObjectPage(
            {
                appId: "zqmexpiryui",
                componentId: "ExpiryItemObjectPage",
                entitySet: "",
                contextPath: "/ExpiryHeader/_WhereUsed"
            },
            CustomExpiryItemObjectPageGenerated
        )
    },
    async: true
});

export default runner;
