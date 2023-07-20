package dev.badbird.valoutils.manager;

import dev.badbird.valoutils.Main;
import dev.badbird.valoutils.endpoints.request.impl.chat.conversations.SendChatRequest;
import dev.badbird.valoutils.objects.chat.Conversation;
import lombok.Data;
import lombok.SneakyThrows;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.HashSet;
import java.util.Set;

@Data
public class ChatManager {
    private Set<Conversation> conversations = new HashSet<>();
    private File loadedFile = null;

    public void send(Conversation conversation, String message) {
        RiotClientConnectionManager connectionManager = new RiotClientConnectionManager();
        SendChatRequest.fromConversation(conversation, message).send(connectionManager);
    }

    @SneakyThrows
    public void sendFile(Conversation conversation) {
        if (loadedFile == null)
            throw new IllegalStateException("No file loaded!");
        RiotClientConnectionManager connectionManager = new RiotClientConnectionManager();
        String data = new String(Files.readAllBytes(loadedFile.toPath()));
        SendChatRequest.fromConversation(conversation, data).send(connectionManager);
    }

    public void sendAnimated(Conversation conversation, long msDelay) {
        // spin up a new thread to send the message
        new Thread(() -> {
            try {
                String data = new String(Files.readAllBytes(loadedFile.toPath()));
                String[] split = data.split("\n");
                for (String s : split) {
                    SendChatRequest.fromConversation(conversation, s).send(Main.getInstance().getConnectionManager());
                    Thread.sleep(msDelay);
                }
            } catch (InterruptedException | IOException e) {
                throw new RuntimeException(e);
            }
        }, "Animated Message Thread").start();
    }
}
