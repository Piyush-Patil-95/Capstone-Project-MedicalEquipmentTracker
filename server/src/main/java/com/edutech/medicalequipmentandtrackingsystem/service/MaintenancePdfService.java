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

import com.edutech.medicalequipmentandtrackingsystem.entitiy.Maintenance;

@Service
public class MaintenancePdfService {

    public byte[] generateMaintenancePdf(Maintenance maintenance) throws IOException {

        try (PDDocument document = new PDDocument();
             ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            PDPage page = new PDPage(PDRectangle.A4);
            document.addPage(page);

            try (PDPageContentStream cs = new PDPageContentStream(document, page)) {

                float x = 50;
                float y = 770;

                cs.beginText();
                cs.setFont(PDType1Font.HELVETICA_BOLD, 18);
                cs.newLineAtOffset(x, y);
                cs.showText("Maintenance Report");
                cs.endText();

                y -= 40;

                y = line(cs, x, y, "Maintenance ID:", safe(maintenance.getId()));
                y = line(cs, x, y, "Status:", safe(maintenance.getStatus()));
                y = line(cs, x, y, "Scheduled Date:", formatDate(maintenance.getScheduledDate()));
                y = line(cs, x, y, "Completed Date:", formatDate(maintenance.getCompletedDate()));
                y = line(cs, x, y, "Description:", safe(maintenance.getDescription()));

                y -= 15;
                y = section(cs, x, y, "Equipment");
                if (maintenance.getEquipment() != null) {
                    y = line(cs, x, y, "Equipment ID:", safe(maintenance.getEquipment().getId()));
                    y = line(cs, x, y, "Equipment Name:", safe(maintenance.getEquipment().getName()));
                    y = line(cs, x, y, "Description:", safe(maintenance.getEquipment().getDescription()));
                }

                y -= 15;
                y = section(cs, x, y, "Hospital");
                if (maintenance.getEquipment() != null && maintenance.getEquipment().getHospital() != null) {
                    y = line(cs, x, y, "Hospital Name:", safe(maintenance.getEquipment().getHospital().getName()));
                    y = line(cs, x, y, "Location:", safe(maintenance.getEquipment().getHospital().getLocation()));
                }
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
        cs.newLineAtOffset(x + 140, y);
        cs.showText(value != null ? value : "-");
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