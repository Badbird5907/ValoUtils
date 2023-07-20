package dev.badbird.valoutils;

import dev.badbird.valoutils.objects.chat.Conversation;
import li.flor.nativejfilechooser.NativeJFileChooser;
import lombok.Getter;

import javax.swing.*;
import java.awt.*;

@Getter
public class MainGUI {
    private JFrame frame;
    private JTabbedPane tabbedPane1;
    private JPanel panel1;
    private JComboBox convoSelect;
    private JButton loadFileButton;
    private JButton sendButton;
    private JSpinner msBetweenLines;

    public MainGUI() {
        frame = new JFrame("ValoUtils");
        // set frame size
        frame.setContentPane(panel1);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.pack();
        frame.setVisible(true);
        frame.setSize(600, 600);

        msBetweenLines.setValue(-1);

        loadFileButton.addActionListener(e -> {
            JFileChooser chooser = new NativeJFileChooser();
            chooser.showOpenDialog(frame);
            Main.getInstance().getChatManager().setLoadedFile(chooser.getSelectedFile());
            loadFileButton.setText("Loaded file: " + chooser.getSelectedFile().getName() + " - Click to load another file");
        });
        sendButton.addActionListener(e -> {
            if (((Integer) msBetweenLines.getValue()) > 0) {
                Main.getInstance().getChatManager().sendAnimated((Conversation) convoSelect.getSelectedItem(), (Integer) msBetweenLines.getValue());
                return;
            }
            try {
                Main.getInstance().getChatManager().sendFile((Conversation) convoSelect.getSelectedItem());
            } catch (Exception ex) {
                ex.printStackTrace();
                JOptionPane.showMessageDialog(frame, "Error sending file: " + ex.getMessage(), "Error", JOptionPane.ERROR_MESSAGE);
            }
        });
    }

}
