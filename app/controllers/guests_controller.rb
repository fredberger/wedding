class GuestsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def index
    guests = Guest.all
    render json: { status: "ok", guests: guests }
  end

  def attend
    @attend = Guest.where(attend: true)
    @attend_count = attend_count(@attend)
    @not = Guest.where(attend: false)
    @guests = Guest.where(attend: nil)
    @guests_count = @guests.count
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

  def attend_count(guests)
    count = 0
    guests.each do |g|
      count += 1
      g.list.each do |x|
        if x.size > 0
          count += 1
        end
      end
    end
    count
  end
end
