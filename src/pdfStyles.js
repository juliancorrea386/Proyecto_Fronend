import { StyleSheet } from "@react-pdf/renderer";

const pdfStyles = StyleSheet.create({
    page: {
        padding: 30,
    },
    image: {
        width: '100%',
        height: 'auto',
        marginBottom: 20,
    }, table: {
        display: "table",
        width: "auto",
        borderStyle: "solid",
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        flexDirection: "row",
    },
    tableColNoRemision: {
        width: "5%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    tableColNombre: {
        width: "40%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    tableColCantidad: {
        width: "20%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    tableColRecibidas: {
        width: "15%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    tableColPendientes: {
        width: "20%",
        borderStyle: "solid",
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
    },
    tableCell: {
        margin: "auto",
        marginTop: 5,
        fontSize: 10,
    },
    signatureSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30,
    },
    signature: {
        textAlign: 'center',
    },
});

export default pdfStyles;
