class ProspectsController < ApplicationController
  def index
  end

  def new
    @prospect = Prospect.new
  end

  def create
    @prospect = Prospect.new(prospect_params)
    if @prospect.save
      redirect_to thank_you_prospects_path
    else
      flash[:succes] = "Please check your input for the error(s) below."
      render "new"
    end
  end

  def thank_you

  end

  private
  def prospect_params
    params.require(:prospect).permit(:first_name, :last_name, :gender,
                                    :email, :phone_number, :skype_id,
                                    :payment_type, :comment )
  end
end
