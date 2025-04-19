# backend/ngrok_setup.py
# This script helps set up and manage your ngrok tunnel

import subprocess
import requests
import json
import time
import os

def start_ngrok(port=5000):
    """
    Start ngrok tunnel to the specified port
    """
    # Check if ngrok is installed
    try:
        # Start ngrok process - this assumes ngrok is in your PATH
        # If you're using a specific ngrok auth token, add --authtoken your_token before http
        cmd = f"ngrok http {port}"
        
        print(f"Starting ngrok tunnel to http://localhost:{port}")
        proc = subprocess.Popen(cmd.split(), stdout=subprocess.PIPE)
        
        # Wait for tunnel to be established
        time.sleep(3)
        
        # Get the public URL from ngrok API
        try:
            response = requests.get("http://localhost:4040/api/tunnels")
            tunnels = json.loads(response.text)["tunnels"]
            
            if tunnels:
                for tunnel in tunnels:
                    if tunnel["proto"] == "https":
                        tunnel_url = tunnel["public_url"]
                        print(f"Ngrok tunnel established: {tunnel_url}")
                        
                        # Save the URL to a file for reference
                        with open("ngrok_url.txt", "w") as f:
                            f.write(tunnel_url)
                        
                        return tunnel_url
            else:
                print("No tunnels established. Check ngrok logs.")
                return None
        except Exception as e:
            print(f"Error getting ngrok tunnel URL: {str(e)}")
            return None
    
    except Exception as e:
        print(f"Error starting ngrok: {str(e)}")
        print("Make sure ngrok is installed and available in your PATH")
        return None

def check_specific_url(target_url="https://4aba-103-104-226-58.ngrok-free.app"):
    """
    Check if the specific URL is among the active ngrok tunnels
    """
    try:
        response = requests.get("http://localhost:4040/api/tunnels")
        tunnels = json.loads(response.text)["tunnels"]
        
        for tunnel in tunnels:
            if tunnel["public_url"] == target_url:
                print(f"Target URL {target_url} is active")
                return True
        
        print(f"Target URL {target_url} is not active in current ngrok session")
        return False
    except Exception as e:
        print(f"Error checking ngrok tunnels: {str(e)}")
        return False

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Manage ngrok tunnel for Flask server")
    parser.add_argument("--port", type=int, default=5000, help="Port to tunnel (default: 5000)")
    parser.add_argument("--check", action="store_true", help="Check if specific URL is active")
    
    args = parser.parse_args()
    
    if args.check:
        check_specific_url()
    else:
        start_ngrok(args.port)