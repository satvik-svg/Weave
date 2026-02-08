
import sys
import os

# Add current directory to path
sys.path.append(os.getcwd())

print("Checking backend imports and syntax...")

try:
    # Try importing main to verify dependencies and syntax
    import main
    print("✅ Successfully imported main.py")
    
    # Try importing agents
    from agents import matching_agent, discovery_agent, planning_agent
    print("✅ Successfully imported agents")
    
    print("\nBackend build check PASSED. Application structure is valid.")
    sys.exit(0)
except ImportError as e:
    print(f"\n❌wb IMPORT ERROR: {e}")
    print("This usually means a dependency is missing from requirements.txt")
    sys.exit(1)
except SyntaxError as e:
    print(f"\n❌ SYNTAX ERROR: {e}")
    sys.exit(1)
except Exception as e:
    print(f"\n❌ UNEXPECTED ERROR: {e}")
    sys.exit(1)
