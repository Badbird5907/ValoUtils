package dev.badbird.valoutils;

import dev.badbird.valoutils.objects.chat.Conversation;
import li.flor.nativejfilechooser.NativeJFileChooser;
import lombok.Getter;

import javax.swing.*;
import java.awt.*;

@Getter
public class MainGUI {
    private static final int width = 600, height = 600;

    private JFrame frame;
    private JTabbedPane tabbedPane1;
    private JPanel panel1;
    private JComboBox convoSelect;
    private JButton loadFileButton;
    private JButton sendButton;
    private JSpinner msBetweenLines;

    public MainGUI() {
        init();
        frame = new JFrame("ValoUtils");
        // set frame size
        frame.setContentPane(panel1);
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.pack();
        frame.setVisible(true);
        frame.setSize(width,height);

        msBetweenLines.setValue(-1);

        loadFileButton.addActionListener(e -> {
            JFileChooser chooser = new NativeJFileChooser();
            chooser.showOpenDialog(frame);
            Main.getInstance().getChatManager().setLoadedFile(chooser.getSelectedFile());
            if (chooser.getSelectedFile() != null)
                loadFileButton.setText("Loaded file: " + chooser.getSelectedFile().getName() + " - Click to load another file");
            else loadFileButton.setText("Load file");
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

    public void init() { // shitty guy because I had to switch from IntelliJ's GUI builder to just plain code
        tabbedPane1 = new JTabbedPane();
        panel1 = new JPanel();
        convoSelect = new JComboBox();
        loadFileButton = new JButton();
        loadFileButton.setText("Load file");
        sendButton = new JButton();
        sendButton.setText("Send");
        msBetweenLines = new JSpinner();

        // Set preferred sizes for JComboBox, JButton, and JSpinner to make them smaller
        convoSelect.setPreferredSize(new Dimension(width - 10, convoSelect.getPreferredSize().height));
        loadFileButton.setPreferredSize(new Dimension(width - 10, loadFileButton.getPreferredSize().height));
        sendButton.setPreferredSize(new Dimension(width - 10, sendButton.getPreferredSize().height));
        msBetweenLines.setPreferredSize(new Dimension(width - 10, msBetweenLines.getPreferredSize().height));

        JComponent tab1 = new JPanel();
        tab1.setLayout(new GridBagLayout());

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(2,0,2,0);

        gbc.gridx = 0;
        gbc.gridy = 0;
        tab1.add(new JLabel("Select Conversation"), gbc);

        gbc.gridy++;
        tab1.add(convoSelect, gbc);

        gbc.gridy++;
        tab1.add(loadFileButton, gbc);

        gbc.gridy++;
        tab1.add(new JLabel("ms between lines (-1 for all at once)"), gbc);

        gbc.gridy++;
        tab1.add(msBetweenLines, gbc);

        gbc.gridy++;
        tab1.add(sendButton, gbc);

        tabbedPane1.addTab("Chat", tab1);
        tabbedPane1.setPreferredSize(new Dimension(width - 10, height));

        panel1.setLayout(new BoxLayout(panel1, BoxLayout.Y_AXIS));
        panel1.add(tabbedPane1);
    }


}
