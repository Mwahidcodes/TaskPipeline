resource "aws_security_group" "share4good_sg" {
  name        = "share4good-devops-sg"
  description = "Security Group for Share4Good DevOps Pipeline"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 9000
    to_port     = 9000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_instance" "taskpipeline_prod_server" {
  ami           = "ami-0989fb15ce71ba39e" # Ubuntu 24.04 LTS - eu-north-1 (Stockholm)
  instance_type = "m7i-flex.large"        # 2 vCPU, 8GB RAM

  vpc_security_group_ids = [aws_security_group.share4good_sg.id]

  tags = {
    Name        = "TaskPipeline-Production-Server"
    Environment = "Production"
    Project     = "Share4Good"
  }
}

output "server_public_ip" {
  value       = aws_instance.taskpipeline_prod_server.public_ip
  description = "Production server ka public IP"
}