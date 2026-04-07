package com.edutech.medicalequipmentandtrackingsystem.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.stereotype.Service;

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Order;

@Service
public class OrderPdfService {

    public byte[] generateOrderPdf(Order order) throws IOException {

        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            try (PDPageContentStream cs = new PDPageContentStream(document, page)) {

                float x = 50;
                float y = 770;

                // Title
                cs.beginText();
                cs.setFont(PDType1Font.HELVETICA_BOLD, 18);
                cs.newLineAtOffset(x, y);
                cs.showText("Order Details");
                cs.endText();

                y -= 40;

                y = line(cs, x, y, "Order ID:", safe(order.getId()));
                y = line(cs, x, y, "Status:", safe(order.getStatus()));
                y = line(cs, x, y, "Quantity:", safe(order.getQuantity()));
                y = line(cs, x, y, "Order Date:", formatDate(order.getOrderDate()));

                y -= 15;
                y = section(cs, x, y, "Equipment");
                y = line(cs, x, y, "Equipment ID:", safe(order.getEquipment() != null ? order.getEquipment().getId() : null));
                y = line(cs, x, y, "Equipment Name:", safe(order.getEquipment() != null ? order.getEquipment().getName() : null));
                y = line(cs, x, y, "Description:", safe(order.getEquipment() != null ? order.getEquipment().getDescription() : null));

                y -= 15;
                y = section(cs, x, y, "Hospital");
                y = line(cs, x, y, "Hospital ID:", safe(order.getEquipment() != null && order.getEquipment().getHospital() != null
                        ? order.getEquipment().getHospital().getId() : null));
                y = line(cs, x, y, "Hospital Name:", safe(order.getEquipment() != null && order.getEquipment().getHospital() != null
                        ? order.getEquipment().getHospital().getName() : null));
                y = line(cs, x, y, "Location:", safe(order.getEquipment() != null && order.getEquipment().getHospital() != null
                        ? order.getEquipment().getHospital().getLocation() : null));
            }

            document.save(baos);
            return baos.toByteArray();
        }
    }

    private float section(PDPageContentStream cs, float x, float y, String title) throws IOException {
        cs.beginText();
        cs.setFont(PDType1Font.HELVETICA_BOLD, 14);
        cs.newLineAtOffset(x, y);
        cs.showText(title);
        cs.endText();
        return y - 22;
    }

    private float line(PDPageContentStream cs, float x, float y, String label, String value) throws IOException {
        cs.beginText();
        cs.setFont(PDType1Font.HELVETICA_BOLD, 11);
        cs.newLineAtOffset(x, y);
        cs.showText(label);
        cs.endText();

        cs.beginText();
        cs.setFont(PDType1Font.HELVETICA, 11);
        cs.newLineAtOffset(x + 130, y);
        cs.showText(value);
        cs.endText();

        return y - 18;
    }

    private String safe(Object o) {
        return (o == null) ? "-" : String.valueOf(o);
    }

    private String formatDate(Date date) {
        if (date == null) return "-";
        return new SimpleDateFormat("dd-MMM-yyyy").format(date);
    }
}
