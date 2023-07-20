package dev.badbird.valoutils;

import com.formdev.flatlaf.intellijthemes.FlatXcodeDarkIJTheme;
import dev.badbird.valoutils.endpoints.request.impl.chat.conversations.GetConversationsRequest;
import dev.badbird.valoutils.manager.ChatManager;
import dev.badbird.valoutils.manager.RiotClientConnectionManager;
import dev.badbird.valoutils.objects.chat.Conversation;
import lombok.Getter;

import javax.swing.*;
import java.util.Arrays;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Executors;
import java.util.concurrent.ThreadPoolExecutor;

@Getter
public class Main {
    private final ThreadPoolExecutor executor = (ThreadPoolExecutor) Executors.newFixedThreadPool(1);
    private final RiotClientConnectionManager connectionManager = new RiotClientConnectionManager();
    private final ChatManager chatManager = new ChatManager();

    @Getter
    private static Main instance;

    private Thread updateThread;

    private MainGUI gui;

    private Main() {
        // run every 5 seconds
        updateThread = new Thread(() -> {
            while (true) {
                try {
                    chatManager.getConversations().clear();
                    chatManager.getConversations().addAll(Arrays.asList(new GetConversationsRequest().send(connectionManager).get().getConversations()));
                    System.out.println("Updated conversations - " + chatManager.getConversations().size());
                    if (gui != null) {
                        JComboBox convoSelect = gui.getConvoSelect();
                        Conversation selected = (Conversation) convoSelect.getSelectedItem();
                        String selectedCid = selected == null ? null : selected.cid();
                        convoSelect.setModel(new DefaultComboBoxModel(chatManager.getConversations().toArray()));
                        // reselect the previously selected conversation
                        for (int i = 0; i < chatManager.getConversations().size(); i++) {
                            Conversation conversation = (Conversation) convoSelect.getItemAt(i);
                            if (conversation.cid().equals(selectedCid)) {
                                convoSelect.setSelectedIndex(i);
                                break;
                            }
                        }
                    }
                } catch (InterruptedException | ExecutionException e) {
                    throw new RuntimeException(e);
                }
                try {
                    Thread.sleep(5000);
                } catch (InterruptedException e) {
                    throw new RuntimeException(e);
                }
            }
        }, "Update Thread");
        gui = new MainGUI();
        updateThread.start();
    }

    public static void main(String[] args) throws ExecutionException, InterruptedException {
        FlatXcodeDarkIJTheme.setup();
        instance = new Main();
    }
}