class UserMailer < ActionMailer::Base

  def contact_us(params)
    @email = params[:email]
    @name = params[:name]
    @messages = params[:messages]
    mail(:from => admin_email, :to => admin_email, :subject => "Information Requested") do |format|
      format.text do
        render :text => "#{@name} from #{@email} send you a messsage: #{@messages}."
      end
    end
  end

  def admin_email
    "louishoang8899@gmail.com"
  end
end
