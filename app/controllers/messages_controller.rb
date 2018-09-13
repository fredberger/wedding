class MessagesController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    Message.create(object_params)
    render json: { status: "ok" }
  end

  private

  def object_params
    params.require(:message).permit(:body)
  end
end
