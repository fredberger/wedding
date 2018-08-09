class GuestsController < ApplicationController
  # skip_before_action :verify_authenticity_token

  def index
    guests = Guest.all
    render json: { status: "ok", guests: guests }
  end

  def update
    guest = Guest.find(params[:id])
    if guest.update(object_params)
      render json: { status: "ok" }
    end
  end

  private

  def object_params
    params.require(:guest).permit(:name, :attend, :phone, list: [])
  end
end
