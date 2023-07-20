package dev.badbird.valoutils.endpoints.request.impl.chat.conversations;

import dev.badbird.valoutils.endpoints.request.APIRequest;
import dev.badbird.valoutils.endpoints.response.impl.chat.conversations.GetConversationsResponse;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import okhttp3.Request;

import java.util.concurrent.CompletableFuture;

@AllArgsConstructor
@NoArgsConstructor
public class GetConversationsRequest implements APIRequest<GetConversationsResponse> {
    private String cid;
    @Override
    public String getEndpoint() {
        if (cid != null)
            return "/chat/v7/conversations/?cid=" + cid;
        return "/chat/v7/conversations";
    }

    @Override
    public Class<GetConversationsResponse> getResponseType() {
        return GetConversationsResponse.class;
    }

    @Override
    public Request.Builder addData(Request.Builder builder) {
        return null;
    }


}
