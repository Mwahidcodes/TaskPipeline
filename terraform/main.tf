# 1. Security Group Definition (Rules yahan define hain)
resource "aws_security_group" "share4good_sg" {
  name        = "share4good-devops-sg"
  description = "Security Group for Share4Good DevOps Pipeline"

  # SSH Access
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Jenkins Access
  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # App/Custom Access
  ingress {
    from_port   = 9000
    to_port     = 9000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound Rule (All traffic allowed)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# 2. EC2 Instance Definition (Jo upar wali SG use kar raha hai)
resource "aws_instance" "taskpipeline_prod_server" {
  ami           = "ami-0989fb15ce71ba39e"
  instance_type = "m7i-flex.large"

  # Key pair attach karna lazmi hai
  key_name      = "prod-key" 

  # Yahan SG ko call (reference) kiya gaya hai
  vpc_security_group_ids = [aws_security_group.share4good_sg.id]

  tags = {
    Name        = "TaskPipeline-Production-Server"
    Environment = "Production"
    Project     = "Share4Good"
  }
}

