package dev.badbird.valoutils.endpoints.request.impl.chat.conversations;

import com.google.gson.Gson;
import dev.badbird.valoutils.endpoints.request.APIRequest;
import dev.badbird.valoutils.endpoints.response.impl.chat.SendChatResponse;
import dev.badbird.valoutils.objects.chat.Conversation;
import lombok.AllArgsConstructor;
import okhttp3.MediaType;
import okhttp3.Request;
import okhttp3.RequestBody;

@AllArgsConstructor
public class SendChatRequest implements APIRequest<SendChatResponse> {
    private String cid;
    private String message;
    private String type;

    public static SendChatRequest fromConversation(Conversation conversation, String message) {
        return new SendChatRequest(conversation.cid(), message, conversation.type());
    }

    @Override
    public String getEndpoint() {
        return "/chat/v6/messages";
    }

    @Override
    public Class<SendChatResponse> getResponseType() {
        return SendChatResponse.class;
    }

    @Override
    public Request.Builder addData(Request.Builder builder) {
        return builder.post(RequestBody.create(MediaType.parse("application/json"), new Gson().toJson(this)));
    }
}
